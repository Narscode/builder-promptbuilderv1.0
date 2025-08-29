import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export function useMissions() {
  const queryClient = useQueryClient();

  const missionsQuery = useQuery({
    queryKey: ["/api/missions"],
  });

  const userProgressQuery = useQuery({
    queryKey: ["/api/user/user1/progress"],
  });

  const leaderboardQuery = useQuery({
    queryKey: ["/api/leaderboard"],
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async (data: { questionId: string; answer: string; timeSpent?: number }) => {
      const response = await apiRequest("POST", "/api/user/user1/answer", data);
      return response.json();
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["/api/user/user1/progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/user1"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
    },
  });

  return {
    missions: missionsQuery.data || [],
    userProgress: userProgressQuery.data || [],
    leaderboard: leaderboardQuery.data || [],
    submitAnswer: submitAnswerMutation.mutate,
    isSubmitting: submitAnswerMutation.isPending,
    isLoading: missionsQuery.isLoading || userProgressQuery.isLoading,
  };
}
