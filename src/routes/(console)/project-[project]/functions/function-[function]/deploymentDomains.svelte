<script lang="ts">
    import { DropList, DropListLink, Trim } from '$lib/components';
    import { Pill } from '$lib/elements';
    import type { Models } from '@appwrite.io/console';

    export let domain: Models.ProxyRuleList;
    let showDropdown = false;
    $: rulesLength = domain?.rules?.length ?? 0;
</script>

<div class="u-flex u-gap-4 u-cross-center">
    {#if rulesLength > 0}
        <a
            href={`http://${domain.rules[0].domain}`}
            target="_blank"
            class="u-flex u-gap-4 u-cross-center">
            <Trim alternativeTrim>
                <span class="link">
                    {domain.rules[0].domain}
                </span>
            </Trim>
            <span class="icon-external-link" aria-hidden="true" />
        </a>
    {/if}

    {#if rulesLength > 1}
        <DropList bind:show={showDropdown} scrollable>
            <Pill button on:click={() => (showDropdown = !showDropdown)}>
                +{rulesLength - 1}
            </Pill>
            <svelte:fragment slot="list">
                {#each domain.rules as rule, i}
                    {#if i !== 0}
                        <DropListLink href={`http://${rule.domain}`} external icon="external-link">
                            {rule.domain}
                        </DropListLink>
                    {/if}
                {/each}
            </svelte:fragment>
        </DropList>
    {/if}

    {#if rulesLength === 0}
        <p>No domains available</p>
    {/if}
</div>
