import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Mission, Question } from "@shared/schema";

interface MissionModalProps {
  mission: Mission;
  onClose: () => void;
  onShowResults: (result: any) => void;
}

export default function MissionModal({ mission, onClose, onShowResults }: MissionModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const queryClient = useQueryClient();

  const { data: questions = [] } = useQuery({
    queryKey: ["/api/missions", mission.id, "questions"]
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async (data: { questionId: string; answer: string }) => {
      const response = await apiRequest("POST", "/api/user/user1/answer", data);
      return response.json();
    },
    onSuccess: (result) => {
      // Invalidate progress queries
      queryClient.invalidateQueries({ queryKey: ["/api/user/user1/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/user1"] });
      
      onShowResults(result);
    },
  });

  const currentQuestion = questions[currentQuestionIndex] as Question;
  const progressPercentage = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return;
    
    submitAnswerMutation.mutate({
      questionId: currentQuestion.id,
      answer: selectedAnswer
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer("");
    } else {
      // Mission completed
      onClose();
    }
  };

  const getColorClasses = (colorScheme: string) => {
    switch (colorScheme) {
      case 'red':
        return { badge: 'bg-red-600 text-red-50', progress: 'bg-red-500', icon: 'bg-red-500/20' };
      case 'amber':
        return { badge: 'bg-amber-600 text-amber-50', progress: 'bg-amber-500', icon: 'bg-amber-500/20' };
      case 'emerald':
        return { badge: 'bg-emerald-600 text-emerald-50', progress: 'bg-emerald-500', icon: 'bg-emerald-500/20' };
      case 'purple':
        return { badge: 'bg-purple-600 text-purple-50', progress: 'bg-purple-500', icon: 'bg-purple-500/20' };
      case 'blue':
        return { badge: 'bg-blue-600 text-blue-50', progress: 'bg-blue-500', icon: 'bg-blue-500/20' };
      case 'orange':
        return { badge: 'bg-orange-600 text-orange-50', progress: 'bg-orange-500', icon: 'bg-orange-500/20' };
      default:
        return { badge: 'bg-primary text-primary-foreground', progress: 'bg-primary', icon: 'bg-primary/20' };
    }
  };

  const colors = getColorClasses(mission.colorScheme);

  if (!currentQuestion) {
    return null;
  }

  const renderQuestionContent = () => {
    const content = currentQuestion.content as any;

    switch (currentQuestion.type) {
      case 'image':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {content.optionA && (
              <div className="relative">
                <img 
                  src={content.optionA.img} 
                  alt="Option A" 
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=Image+A";
                  }}
                />
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">Image A</div>
              </div>
            )}
            {content.optionB && (
              <div className="relative">
                <img 
                  src={content.optionB.img} 
                  alt="Option B" 
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=Image+B";
                  }}
                />
                <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">Image B</div>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4 mb-6">
            {Object.entries(content).map(([key, value]: [string, any]) => (
              <div key={key} className="p-4 bg-muted rounded-lg">
                <div className="font-medium mb-2">Option {key.slice(-1).toUpperCase()}:</div>
                <div className="text-muted-foreground">{value.text}</div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="bg-muted rounded-xl p-6 mb-6">
            <p className="text-muted-foreground">Question content will be displayed here based on type: {currentQuestion.type}</p>
          </div>
        );
    }
  };

  const renderAnswerOptions = () => {
    const content = currentQuestion.content as any;

    switch (currentQuestion.type) {
      case 'image':
        return (
          <div className="space-y-4 mb-8">
            <button 
              className={`answer-option w-full text-left p-4 border rounded-xl transition-colors ${
                selectedAnswer === 'A' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'
              }`}
              onClick={() => handleSelectAnswer('A')}
              data-testid="answer-option-a"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                  selectedAnswer === 'A' ? 'border-primary' : 'border-border'
                }`}>
                  {selectedAnswer === 'A' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                </div>
                <span>Image A is AI-generated</span>
              </div>
            </button>

            <button 
              className={`answer-option w-full text-left p-4 border rounded-xl transition-colors ${
                selectedAnswer === 'B' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'
              }`}
              onClick={() => handleSelectAnswer('B')}
              data-testid="answer-option-b"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                  selectedAnswer === 'B' ? 'border-primary' : 'border-border'
                }`}>
                  {selectedAnswer === 'B' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                </div>
                <span>Image B is AI-generated</span>
              </div>
            </button>

            <button 
              className={`answer-option w-full text-left p-4 border rounded-xl transition-colors ${
                selectedAnswer === 'C' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'
              }`}
              onClick={() => handleSelectAnswer('C')}
              data-testid="answer-option-c"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                  selectedAnswer === 'C' ? 'border-primary' : 'border-border'
                }`}>
                  {selectedAnswer === 'C' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                </div>
                <span>Both images are real</span>
              </div>
            </button>

            <button 
              className={`answer-option w-full text-left p-4 border rounded-xl transition-colors ${
                selectedAnswer === 'D' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'
              }`}
              onClick={() => handleSelectAnswer('D')}
              data-testid="answer-option-d"
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                  selectedAnswer === 'D' ? 'border-primary' : 'border-border'
                }`}>
                  {selectedAnswer === 'D' && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                </div>
                <span>Both images are AI-generated</span>
              </div>
            </button>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4 mb-8">
            {Object.entries(content).map(([key, value]: [string, any]) => {
              const optionKey = key.slice(-1).toUpperCase(); // Get A, B, C from optionA, optionB, optionC
              return (
                <button 
                  key={key}
                  className={`answer-option w-full text-left p-4 border rounded-xl transition-colors ${
                    selectedAnswer === optionKey ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-primary/5'
                  }`}
                  onClick={() => handleSelectAnswer(optionKey)}
                  data-testid={`answer-option-${optionKey.toLowerCase()}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 border-2 rounded-full flex items-center justify-center ${
                      selectedAnswer === optionKey ? 'border-primary' : 'border-border'
                    }`}>
                      {selectedAnswer === optionKey && <div className="w-3 h-3 bg-primary rounded-full"></div>}
                    </div>
                    <span>{value.text}</span>
                  </div>
                </button>
              );
            })}
          </div>
        );

      default:
        return (
          <div className="space-y-4 mb-8">
            <p className="text-muted-foreground">Answer options for {currentQuestion.type} questions will be implemented.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop bg-black/50" data-testid="mission-modal">
      <div className="bg-card border border-border rounded-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Mission Header */}
        <div className="p-8 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${colors.icon} rounded-2xl flex items-center justify-center text-3xl`}>
                {mission.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold" data-testid="mission-title">{mission.title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`${colors.badge} px-3 py-1 rounded-full text-xs font-semibold`}>
                    {mission.difficulty}
                  </span>
                  <span className="text-muted-foreground text-sm">{mission.pointsPerQuestion} points per question</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2" data-testid="close-mission">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress and Timer */}
          <div className="flex items-center justify-between">
            <div className="flex-1 mr-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="text-sm font-medium" data-testid="question-progress">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`${colors.progress} h-2 rounded-full progress-animation`} 
                  style={{ width: `${progressPercentage}%` }}
                  data-testid="mission-progress-bar"
                ></div>
              </div>
            </div>
            <div 
              className={`text-2xl font-mono font-bold ${timeRemaining <= 30 ? 'timer-urgent text-red-400' : 'text-primary'}`}
              data-testid="mission-timer"
            >
              {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4" data-testid="question-text">{currentQuestion.questionText}</h3>
            
            {/* Question Content Area */}
            <div className="bg-muted rounded-xl p-6 mb-6">
              {renderQuestionContent()}
            </div>
          </div>

          {/* Answer Options */}
          {renderAnswerOptions()}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button 
              className="text-muted-foreground hover:text-foreground px-4 py-2"
              data-testid="skip-question"
            >
              Skip Question
            </button>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(prev => prev - 1);
                    setSelectedAnswer("");
                  }
                }}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 border border-border rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
                data-testid="previous-question"
              >
                Previous
              </button>
              <button 
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || submitAnswerMutation.isPending}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                data-testid="submit-answer"
              >
                {submitAnswerMutation.isPending ? 'Submitting...' : 'Submit Answer'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
