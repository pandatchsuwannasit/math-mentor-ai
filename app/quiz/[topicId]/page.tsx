import { SubjectQuiz } from "@/components/subject-quiz"
import { getAllCurriculumTopics } from "@/lib/curriculum"

export default function TopicQuizPage({ params }: { params: { topicId: string } }) {
  return <SubjectQuiz topicId={params.topicId} />
}

export function generateMetadata({ params }: { params: { topicId: string } }) {
  const allTopics = getAllCurriculumTopics()
  const topic = allTopics.find((t) => t.id === params.topicId)
  return {
    title: topic?.title || "แบบทดสอบ",
  }
}
