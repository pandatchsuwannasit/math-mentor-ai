import { SubjectQuiz } from "@/components/subject-quiz"
import { getAllCurriculumTopics } from "@/lib/curriculum"

export default async function TopicQuizPage({ params }: { params: Promise<{ topicId: string }> }) {
  // In Next.js 16, params is a Promise that needs to be awaited
  const resolvedParams = await params
  const topicId = resolvedParams.topicId
  
  // Defensive check - never allow undefined topicId
  if (!topicId || topicId.trim() === "") {
    const allTopics = getAllCurriculumTopics()
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">ข้อผิดพลาด: ไม่พบรหัสหัวข้อ</h1>
        <p className="mt-2 text-slate-400">กรุณากลับไปเลือกหัวข้อจากหน้าเรียน</p>
        <p className="mt-4 text-sm text-red-400">Received params: {JSON.stringify(resolvedParams)}</p>
        <p className="mt-4 text-sm text-yellow-400">Available topics: {allTopics.map(t => t.id).join(", ")}</p>
      </div>
    )
  }
  
  return <SubjectQuiz topicId={topicId} />
}

export async function generateMetadata({ params }: { params: Promise<{ topicId: string }> }) {
  const resolvedParams = await params
  const allTopics = getAllCurriculumTopics()
  const topic = allTopics.find((t) => t.id === resolvedParams.topicId)
  return {
    title: topic?.title || "แบบทดสอบ",
  }
}
