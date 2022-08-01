import { useEffect, useState } from 'react'
import { List, showToast, Toast } from '@raycast/api'
import Parser from 'rss-parser'
import { ArticleListItem } from './article-list-item'

interface State {
  isLoading: boolean
  items: Parser.Item[]
  error?: Error
}

const parser = new Parser()

export default function Command() {
  const [state, setState] = useState<State>({ items: [], isLoading: true })

  useEffect(() => {
    async function fetchArticles() {
      setState(previous => ({ ...previous, isLoading: true }))
      try {
        const feed = await parser.parseURL(
          `https://www.pravda.com.ua/eng/rss/view_pubs/`
        )
        setState(previous => ({
          ...previous,
          items: feed.items,
          isLoading: false
        }))
      } catch (error) {
        setState(previous => ({
          ...previous,
          error:
            error instanceof Error ? error : new Error('Something went wrong'),
          isLoading: false,
          items: []
        }))
      }
    }

    fetchArticles()
  }, [])

  useEffect(() => {
    if (state.error) {
      showToast({
        style: Toast.Style.Failure,
        title: 'Failed loading news',
        message: state.error.message
      })
    }
  }, [state.error])

  return (
    <List isLoading={(!state.items && !state.error) || state.isLoading}>
      {state.items?.map((item, index) => (
        <ArticleListItem key={item.guid} item={item} index={index} />
      ))}
    </List>
  )
}
