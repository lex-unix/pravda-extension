import { useEffect, useState } from 'react'
import { List, showToast, Toast } from '@raycast/api'
import Parser from 'rss-parser'
import { startCase } from 'lodash'
import { ArticleListItem } from './article-list-item'

enum Topic {
  AllNews = 'view_news',
  MainViews = 'view_mainnews',
  Publications = 'view_pubs'
}

interface State {
  isLoading: boolean
  items: Parser.Item[]
  topic: Topic | null
  error?: Error
}

const parser = new Parser()

export default function Command() {
  const [state, setState] = useState<State>({
    items: [],
    isLoading: true,
    topic: null
  })

  useEffect(() => {
    if (!state.topic) {
      return
    }
    async function fetchArticles() {
      setState(previous => ({ ...previous, isLoading: true }))
      try {
        const feed = await parser.parseURL(
          `https://www.pravda.com.ua/eng/rss/${state.topic}/`
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
  }, [state.topic])

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
    <List
      isLoading={(!state.items && !state.error) || state.isLoading}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Topic"
          storeValue
          onChange={newValue =>
            setState(previous => ({ ...previous, topic: newValue as Topic }))
          }
        >
          {Object.entries(Topic).map(([name, value]) => (
            <List.Dropdown.Item
              key={value}
              title={startCase(name)}
              value={value}
            />
          ))}
        </List.Dropdown>
      }
    >
      {state.items?.map((item, index) => (
        <ArticleListItem key={item.guid} item={item} index={index} />
      ))}
    </List>
  )
}
