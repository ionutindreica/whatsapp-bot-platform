import React from 'react'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

describe('Card Components', () => {
  it('renders Card with all subcomponents', () => {
    render(
      <Card data-testid="test-card">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Action Button</button>
        </CardFooter>
      </Card>
    )

    expect(screen.getByTestId('test-card')).toBeInTheDocument()
    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Description')).toBeInTheDocument()
    expect(screen.getByText('Card content goes here')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /action button/i })).toBeInTheDocument()
  })

  it('renders Card with only content', () => {
    render(
      <Card>
        <CardContent>
          <p>Simple card content</p>
        </CardContent>
      </Card>
    )

    expect(screen.getByText('Simple card content')).toBeInTheDocument()
  })

  it('renders Card with header only', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Header Only</CardTitle>
        </CardHeader>
      </Card>
    )

    expect(screen.getByText('Header Only')).toBeInTheDocument()
  })

  it('applies custom className to Card', () => {
    render(<Card className="custom-card-class" data-testid="custom-card">Content</Card>)
    expect(screen.getByTestId('custom-card')).toHaveClass('custom-card-class')
  })

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Card ref={ref} data-testid="ref-card">Card with ref</Card>)
    
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveTextContent('Card with ref')
  })

  it('has proper accessibility structure', () => {
    render(
      <Card role="article" aria-labelledby="card-title">
        <CardHeader>
          <CardTitle id="card-title">Accessible Card</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Accessible content</p>
        </CardContent>
      </Card>
    )

    const card = screen.getByRole('article')
    expect(card).toHaveAttribute('aria-labelledby', 'card-title')
    expect(screen.getByText('Accessible Card')).toHaveAttribute('id', 'card-title')
  })
})
