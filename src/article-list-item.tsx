import { ActionPanel, List, Action, Icon } from '@raycast/api'
import { ArticleItem } from './article-item'
import Parser from 'rss-parser'

export function ArticleListItem(props: { item: Parser.Item; index: number }) {
  return (
    <List.Item
      title={props.item.title ?? 'No title'}
      subtitle={props.item.creator}
      actions={<Actions item={props.item} />}
    />
  )
}

function Actions(props: { item: Parser.Item }) {
  return (
    <ActionPanel>
      <ActionPanel.Section>
        {props.item && (
          <Action.Push
            title="View article"
            target={<ArticleItem item={props.item} />}
            icon={Icon.Book}
          />
        )}
        {props.item.link && (
          <Action.CopyToClipboard content={props.item.link} title="Copy Link" />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  )
}
