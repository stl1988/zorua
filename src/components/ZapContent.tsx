import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { nip19 } from 'nostr-tools';
import { Zap } from 'lucide-react';
import type { NostrEvent } from '@nostrify/nostrify';

import { EmojifiedText } from '@/components/CustomEmoji';
import { ProfileHoverCard } from '@/components/ProfileHoverCard';

import { useAuthor } from '@/hooks/useAuthor';
import { useFormatMoney } from '@/hooks/useFormatMoney';
import { extractZapAmount, extractZapMessage } from '@/hooks/useEventInteractions';

import { isNostrId } from '@/lib/nostrId';

interface ZapContentProps {
  /** The zap event itself (kind 9735 Lightning receipt). */
  event: NostrEvent;
  /**
   * If set, this is a profile-targeted zap and this pubkey is the
   * primary recipient. Renders a muted "Zapped @recipient" context line
   * above the amount. Omit for note-zaps.
   */
  recipientPubkey?: string;
}

/** Renders the body of a standalone zap card. */
export function ZapContent({ event, recipientPubkey }: ZapContentProps) {
  const sats = useMemo(
    () => Math.floor(extractZapAmount(event) / 1000),
    [event],
  );

  const message = extractZapMessage(event);
  const { format: formatMoney } = useFormatMoney();

  return (
    <div className="mt-2 space-y-2">
      {recipientPubkey && isNostrId(recipientPubkey) ? (
        <ZapRecipientLine pubkey={recipientPubkey} />
      ) : null}

      {sats > 0 && (
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-3xl font-bold text-amber-500 tabular-nums">
            {formatMoney(sats)}
          </span>
        </div>
      )}

      {message && (
        <p className="text-[15px] leading-relaxed text-foreground whitespace-pre-wrap break-words">
          {message}
        </p>
      )}
    </div>
  );
}

/** Muted "⚡ Zapped @recipient" context line. */
function ZapRecipientLine({ pubkey }: { pubkey: string }) {
  const author = useAuthor(pubkey);
  const metadata = author.data?.metadata;
  const displayName = metadata?.name ?? metadata?.display_name ?? 'Anonymous';
  const npubEncoded = useMemo(() => nip19.npubEncode(pubkey), [pubkey]);

  return (
    <div className="flex items-center gap-x-1 text-sm text-muted-foreground min-w-0 overflow-hidden">
      <Zap className="size-3.5 text-amber-500 shrink-0" />
      <span className="shrink-0">Zapped</span>
      <ProfileHoverCard pubkey={pubkey} asChild>
        <Link
          to={`/${npubEncoded}`}
          className="text-primary hover:underline truncate"
          onClick={(e) => e.stopPropagation()}
        >
          @{author.data?.event ? (
            <EmojifiedText tags={author.data.event.tags}>{displayName}</EmojifiedText>
          ) : (
            displayName
          )}
        </Link>
      </ProfileHoverCard>
    </div>
  );
}
