import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { checkPriceChanges } from '@/lib/flight-api';
import { sendPriceAlertEmail } from '@/lib/email-supabase';

// Workaround for TypeScript strict mode with Supabase types
const db = supabaseAdmin as any;

// This endpoint should be called periodically by a cron job
// For example, using Vercel Cron Jobs or a service like cron-job.org

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized (simple token check)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key';

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all active price alerts
    const { data: alerts, error: alertsError } = await db
      .from('price_alerts')
      .select('*')
      .eq('active', true);

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError);
      return NextResponse.json(
        { error: 'Failed to fetch alerts' },
        { status: 500 }
      );
    }

    if (!alerts || alerts.length === 0) {
      return NextResponse.json({
        message: 'No active alerts to check',
        checked: 0,
      });
    }

    let checkedCount = 0;
    let notificationsSent = 0;

    // Check each alert
    for (const alert of alerts) {
      try {
        // Check price changes
        const { currentPrice, priceChange } = await checkPriceChanges(
          alert.origin,
          alert.destination,
          alert.departure_date_range_start,
          alert.departure_date_range_end
        );

        // Update the alert with the latest price
        await db
          .from('price_alerts')
          .update({
            last_known_price: currentPrice,
            last_checked_at: new Date().toISOString(),
          })
          .eq('id', alert.id);

        checkedCount++;

        // Determine if we should send a notification
        let shouldNotify = false;

        // If there's a threshold price and current price is below it
        if (alert.threshold_price && currentPrice <= alert.threshold_price) {
          shouldNotify = true;
        }

        // If there's a significant price change (more than 5%)
        if (alert.last_known_price) {
          const percentChange = Math.abs(priceChange / alert.last_known_price);
          if (percentChange >= 0.05) {
            shouldNotify = true;
          }
        }

        // Send notification if needed
        if (shouldNotify && alert.notification_email) {
          await sendPriceAlertEmail(
            alert.notification_email,
            alert.origin,
            alert.destination,
            currentPrice,
            alert.last_known_price || currentPrice,
            priceChange
          );

          notificationsSent++;
        }
      } catch (error) {
        console.error(`Error checking alert ${alert.id}:`, error);
        // Continue with next alert
      }
    }

    return NextResponse.json({
      message: 'Price alerts checked successfully',
      checked: checkedCount,
      notificationsSent,
    });
  } catch (error) {
    console.error('Error in check-alerts cron:', error);
    return NextResponse.json(
      { error: 'An error occurred while checking alerts' },
      { status: 500 }
    );
  }
}
