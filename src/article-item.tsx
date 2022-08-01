import React, { useEffect, useState } from 'react'
import { Action, ActionPanel, Detail } from '@raycast/api'
import Parser from 'rss-parser'

type State = {
  title: string
  content: string
  authour: string
  categories: string
  link: string
  imageUrl: string
}

export const ArticleItem: React.FC<{ item: Parser.Item }> = ({ item }) => {
  const [state, setState] = useState<State>({
    title: '',
    content: '',
    authour: '',
    categories: '',
    link: '',
    imageUrl: ''
  })

  const [markdown, setMarkdown] = useState('')

  useEffect(() => {
    setState({
      title: item.title ?? 'No title available',
      content: item.content ?? '',
      authour: item.creator ?? 'Unknown',
      categories: item.categories?.join(' ') ?? 'No category',
      link: item.link ?? '',
      imageUrl: item.enclosure?.url ?? ''
    })
  }, [])

  useEffect(() => {
    setMarkdown(
      getMarkdown(state.title, state.content, state.link, state.imageUrl)
    )
  }, [state.title, state.content, state.link, state.imageUrl])

  return (
    <Detail
      markdown={markdown}
      actions={<Actions link={state.link} />}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.TagList title="Category">
            <Detail.Metadata.TagList.Item
              text={state.categories}
              color={'#eed535'}
            />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link
            target={state.link}
            title="Full article"
            text="Read full article"
          />
        </Detail.Metadata>
      }
    />
  )
}

const Actions: React.FC<{ link: string }> = ({ link }) => {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        <Action.OpenInBrowser url={link} />
        <Action.CopyToClipboard content={link} title="Copy Link" />
      </ActionPanel.Section>
    </ActionPanel>
  )
}

const getMarkdown = (
  title: string,
  content: string,
  link: string,
  imageUrl: string
) => {
  const markdownImg = `![](${imageUrl})`
  return `
# ${title}

${content} 

[Read More](${link})

${imageUrl ? markdownImg : ''}
  `
}
