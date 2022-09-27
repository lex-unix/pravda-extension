import React, { useState } from 'react'
import { Action, ActionPanel, Detail, Color } from '@raycast/api'
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
  const [publication] = useState<State>({
    title: item.title ?? 'No title available',
    content: item.content ?? '',
    authour: item.creator ?? 'Unknown',
    categories: item.categories?.join(' ') ?? 'No category',
    link: item.link ?? '',
    imageUrl: item.enclosure?.url ?? ''
  })

  const markdown = getMarkdown(
    publication.title,
    publication.content,
    publication.link,
    publication.imageUrl
  )

  return (
    <Detail
      markdown={markdown}
      actions={<Actions link={publication.link} />}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.TagList title="Category">
            <Detail.Metadata.TagList.Item
              text={publication.categories}
              color={Color.Blue}
            />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Separator />
          <Detail.Metadata.Link
            target={publication.link}
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
