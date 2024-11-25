'use server'

import { Database } from '../lib/database.types'
import { createClient } from '../lib/supabase/server'
import { ErrorBoundaryWrapper } from '../components/ErrorBoundaryWrapper'

type Todo = Database['public']['Tables']['todos']['Row']

export default async function Page() {
  const supabase = createClient()
  const { data: todos } = await supabase.from('todos').select('*').order('created_at', { ascending: false })

  return (
    <ErrorBoundaryWrapper>
      <main className="min-h-screen p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Todos</h1>
          {todos && todos.length > 0 ? (
            <ul className="space-y-2" key="todo-list">
              {(todos || []).map((todo: Todo) => (
                <li 
                  key={`todo-${todo.id}`}
                  className="p-4 bg-white shadow rounded-lg flex items-center gap-4"
                >
                  <span className={todo.is_complete ? 'line-through text-gray-500' : ''}>
                    {todo.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    {todo.created_at.split('T')[0]}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No todos found</p>
          )}                  
        </div>
      </main>
    </ErrorBoundaryWrapper>
  )
}
