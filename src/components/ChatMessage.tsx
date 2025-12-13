import { Message } from '@/types';
import { FlightResultsCard } from './FlightResultsCard';

interface ChatMessageProps {
  message: Message;
  onSetAlert?: (flightId: string) => void;
  onBookFlight?: (flightId: string, bookingUrl: string) => void;
}

export function ChatMessage({ message, onSetAlert, onBookFlight }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-lg px-4 py-2 ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>

        {message.flightResults && message.flightResults.flights.length > 0 && (
          <div className="mt-3">
            <FlightResultsCard
              results={message.flightResults}
              onSetAlert={onSetAlert}
              onBookFlight={onBookFlight}
            />
          </div>
        )}

        <div className="text-xs text-gray-500 mt-1">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}
