import type { Mission } from "@shared/schema";

interface MissionCardProps {
  mission: Mission;
  progress?: {
    questionsCompleted: number;
    totalQuestions: number;
    isCompleted: boolean;
    totalScore: number;
  };
  onStart: () => void;
}

const getColorClasses = (colorScheme: string) => {
  switch (colorScheme) {
    case 'red':
      return {
        bg: 'bg-gradient-to-br from-red-500/10 to-red-600/5',
        border: 'border-red-500/30',
        iconBg: 'bg-red-500/20',
        badge: 'bg-red-600 text-red-50',
        progressBar: 'bg-red-500',
        button: 'bg-red-600 hover:bg-red-700'
      };
    case 'amber':
      return {
        bg: 'bg-gradient-to-br from-amber-500/10 to-amber-600/5',
        border: 'border-amber-500/30',
        iconBg: 'bg-amber-500/20',
        badge: 'bg-amber-600 text-amber-50',
        progressBar: 'bg-amber-500',
        button: 'bg-amber-600 hover:bg-amber-700'
      };
    case 'emerald':
      return {
        bg: 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5',
        border: 'border-emerald-500/30',
        iconBg: 'bg-emerald-500/20',
        badge: 'bg-emerald-600 text-emerald-50',
        progressBar: 'bg-emerald-500',
        button: 'bg-emerald-600 hover:bg-emerald-700'
      };
    case 'purple':
      return {
        bg: 'bg-gradient-to-br from-purple-500/10 to-purple-600/5',
        border: 'border-purple-500/30',
        iconBg: 'bg-purple-500/20',
        badge: 'bg-purple-600 text-purple-50',
        progressBar: 'bg-purple-500',
        button: 'bg-purple-600 hover:bg-purple-700'
      };
    case 'blue':
      return {
        bg: 'bg-gradient-to-br from-blue-500/10 to-blue-600/5',
        border: 'border-blue-500/30',
        iconBg: 'bg-blue-500/20',
        badge: 'bg-blue-600 text-blue-50',
        progressBar: 'bg-blue-500',
        button: 'bg-blue-600 hover:bg-blue-700'
      };
    case 'orange':
      return {
        bg: 'bg-gradient-to-br from-orange-500/10 to-orange-600/5',
        border: 'border-orange-500/30',
        iconBg: 'bg-orange-500/20',
        badge: 'bg-orange-600 text-orange-50',
        progressBar: 'bg-orange-500',
        button: 'bg-orange-600 hover:bg-orange-700'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-primary/10 to-primary/5',
        border: 'border-primary/30',
        iconBg: 'bg-primary/20',
        badge: 'bg-primary text-primary-foreground',
        progressBar: 'bg-primary',
        button: 'bg-primary hover:bg-primary/90'
      };
  }
};

export default function MissionCard({ mission, progress, onStart }: MissionCardProps) {
  const colors = getColorClasses(mission.colorScheme);
  const progressPercentage = progress ? (progress.questionsCompleted / progress.totalQuestions) * 100 : 0;
  const isCompleted = progress?.isCompleted || false;

  return (
    <div 
      className={`mission-card-hover ${colors.bg} border ${colors.border} rounded-2xl p-8 cursor-pointer transition-all duration-300`}
      onClick={onStart}
      data-testid={`mission-card-${mission.id}`}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-16 h-16 ${colors.iconBg} rounded-2xl flex items-center justify-center text-3xl`}>
          {mission.icon}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{mission.title}</h3>
          <div className="flex items-center gap-3">
            <span className={`${colors.badge} px-3 py-1 rounded-full text-xs font-semibold`}>
              {mission.difficulty}
            </span>
            <span className="text-muted-foreground text-sm">{mission.pointsPerQuestion} points each</span>
          </div>
        </div>
      </div>
      
      <p className="text-muted-foreground leading-relaxed mb-6">
        {mission.description}
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium" data-testid={`progress-text-${mission.id}`}>
            {progress?.questionsCompleted || 0}/{mission.totalQuestions} completed
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`${colors.progressBar} h-2 rounded-full progress-animation`} 
            style={{ width: `${progressPercentage}%` }}
            data-testid={`progress-bar-${mission.id}`}
          ></div>
        </div>
        
        {isCompleted ? (
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            Mission Completed!
          </div>
        ) : (
          <button 
            className={`w-full ${colors.button} text-white font-semibold py-3 px-6 rounded-xl transition-colors`}
            data-testid={`start-mission-${mission.id}`}
          >
            {progress?.questionsCompleted ? 'Continue Mission' : 'Start Mission'}
          </button>
        )}
      </div>
    </div>
  );
}
