import { Check, X } from "lucide-react";

interface ResultsModalProps {
  result: {
    isCorrect: boolean;
    pointsEarned: number;
    explanation: string;
    newsUrl?: string;
    questionsCompleted: number;
    isCompleted: boolean;
  };
  onClose: () => void;
  onNext: () => void;
}

export default function ResultsModal({ result, onClose, onNext }: ResultsModalProps) {
  const { isCorrect, pointsEarned, explanation, newsUrl, questionsCompleted, isCompleted } = result;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/50" data-testid="results-modal">
      <div className="bg-card border border-border rounded-2xl max-w-2xl w-full mx-4">
        <div className="p-8 text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center text-4xl ${
            isCorrect ? 'bg-emerald-500/20' : 'bg-red-500/20'
          }`} data-testid="result-icon">
            {isCorrect ? <Check className="w-10 h-10 text-emerald-400" /> : <X className="w-10 h-10 text-red-400" />}
          </div>
          
          <h2 className={`text-3xl font-bold mb-4 ${
            isCorrect ? 'text-emerald-400' : 'text-red-400'
          }`} data-testid="result-title">
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </h2>
          
          <p className="text-xl text-muted-foreground mb-6" data-testid="result-points">
            {isCorrect ? `+${pointsEarned} points earned` : 'No points earned'}
          </p>
          
          <div className="bg-muted rounded-xl p-6 text-left mb-6">
            <h3 className="font-semibold mb-3">Explanation:</h3>
            <p className="text-muted-foreground leading-relaxed" data-testid="result-explanation">
              {explanation}
            </p>
            {newsUrl && (
              <div className="mt-4">
                <a 
                  href={newsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 text-sm underline"
                  data-testid="news-link"
                >
                  Learn more about this topic →
                </a>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {!isCompleted ? (
              <button 
                onClick={onNext}
                className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors"
                data-testid="next-question"
              >
                Next Question
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-xl hover:bg-emerald-700 transition-colors"
                data-testid="complete-mission"
              >
                Mission Complete! 🎉
              </button>
            )}
            <button 
              onClick={onClose}
              className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors"
              data-testid="close-results"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
