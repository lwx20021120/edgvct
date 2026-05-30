import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="flex flex-col items-center justify-center rounded-lg ring-1 ring-white/[0.06] bg-[#111] p-8 text-center">
          <p className="text-body font-semibold text-text-primary">页面加载出错</p>
          <p className="mt-2 text-body-sm text-text-secondary">
            {this.state.error?.message || '未知错误'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-body-sm text-white transition-colors hover:bg-primary-hover"
          >
            重试
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
