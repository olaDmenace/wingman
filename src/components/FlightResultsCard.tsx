import { FlightSearchResult } from '@/types';

interface FlightResultsCardProps {
  results: FlightSearchResult;
  onSetAlert?: (flightId: string) => void;
  onBookFlight?: (flightId: string, bookingUrl: string) => void;
}

export function FlightResultsCard({ results, onSetAlert, onBookFlight }: FlightResultsCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">
          Flight Options: {results.searchParams.origin} → {results.searchParams.destination}
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {results.flights.slice(0, 5).map((flight) => (
          <div key={flight.id} className="p-4 hover:bg-gray-50 transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-gray-900">{flight.airline}</div>
                <div className="text-sm text-gray-600">
                  {formatTime(flight.departureTime)} - {formatTime(flight.arrivalTime)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {flight.currency}{flight.price}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
              <span>{formatDuration(flight.duration)}</span>
              <span>•</span>
              <span>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onSetAlert?.(flight.id)}
                className="px-3 py-1.5 text-sm border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
              >
                Set Price Alert
              </button>
              {flight.bookingUrl && (
                <button
                  onClick={() => onBookFlight?.(flight.id, flight.bookingUrl!)}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Book Flight
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {results.flights.length > 5 && (
        <div className="bg-gray-50 px-4 py-2 text-sm text-gray-600 text-center">
          Showing top 5 of {results.flights.length} results
        </div>
      )}
    </div>
  );
}
