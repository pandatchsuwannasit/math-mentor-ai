import { AuthGuard } from "@/components/auth-guard"
import { QuizShell } from "@/components/quiz-shell"
import LessonContent from "./lesson-content"

type Props = {
  params: Promise<{ topicId: string }>
}

export default async function LessonPage({ params }: Props) {
  const { topicId } = await params
  return (
    <AuthGuard>
      <QuizShell>
        <LessonContent topicId={topicId} />
      </QuizShell>
    </AuthGuard>
  )
}