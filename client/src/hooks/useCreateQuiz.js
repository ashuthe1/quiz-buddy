import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { constants } from '../util/constant';

export default function useCreateQuiz() {
  const queryClient = useQueryClient();

  return useMutation(
    (values) =>
      axios
        .post(`${constants.backendUrl}/api/quiz/create`, values, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access-token')}`,
          },
        })
        .then((res) => res.data),
      {
      onMutate: async (newQuiz) => {
        // cancel any outgoing refetches(so they dont overwrite our optimistic update)
        await queryClient.cancelQueries('createdQuizzes');

        const previousQuizzes = queryClient.getQueryData('createdQuizzes');

        // Optimistically update to new value
        queryClient.setQueryData('createdQuizzes', old => {
          console.log(old);
          old.quizzes = [...old.quizzes, newQuiz];
          return old;
        });

        return { previousQuizzes };
      },
      onError: (err, newQuiz, context) => {
        queryClient.setQueryData('createdQuizzes', context.previousQuizzes);
        console.log(err);
        return Promise.reject(err.message);
      },
      // Always refetch after error or success.
      onSettled: () => {
        queryClient.invalidateQueries('createdQuizzes');
      },
    }
  );
}