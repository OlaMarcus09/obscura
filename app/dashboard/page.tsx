import { getProjectsForCreator, type CreatorProject } from '@/lib/queries'
import { getCurrentCreatorId } from '@/lib/auth'
import { UploadDropzone } from '@/components/upload-dropzone'
import { CopyLink } from '@/components/copy-link'

export const dynamic = 'force-dynamic'

const COLUMNS: { key: CreatorProject['status']; label: string }[] = [
  { key: 'draft', label: 'Draft' },
  { key: 'active', label: 'Active' },
  { key: 'archived', label: 'Archived' },
]

function formatPrice(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

function ProjectCard({ project }: { project: CreatorProject }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition-colors hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-white">{project.title}</h3>
        <span className="shrink-0 text-sm text-white/70">
          {formatPrice(project.price)}
        </span>
      </div>
      <p className="mt-1 text-xs text-white/40">
        {project.assetCount} {project.assetCount === 1 ? 'asset' : 'assets'}
      </p>
      {project.deliveryToken && (
        <div className="mt-3 border-t border-white/5 pt-3">
          <CopyLink token={project.deliveryToken} />
        </div>
      )}
    </div>
  )
}

export default async function DashboardPage() {
  const creatorId = await getCurrentCreatorId()
  const projects = await getProjectsForCreator(creatorId)

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <header className="mb-10">
        <p className="text-xs tracking-[0.2em] text-white/40 uppercase">
          Obscura
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
          Creator Studio
        </h1>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr]">
        <div className="lg:sticky lg:top-12 lg:self-start">
          <UploadDropzone />
        </div>

        <section>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {COLUMNS.map((col) => {
              const items = projects.filter((p) => p.status === col.key)
              return (
                <div key={col.key}>
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-medium text-white/70">
                      {col.label}
                    </h2>
                    <span className="text-xs text-white/30">
                      {items.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {items.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 p-4 text-xs text-white/30">
                        Nothing here yet.
                      </div>
                    ) : (
                      items.map((p) => <ProjectCard key={p.id} project={p} />)
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
