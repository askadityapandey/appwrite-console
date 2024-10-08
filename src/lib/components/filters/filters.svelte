<script lang="ts">
    import { beforeNavigate } from '$app/navigation';
    import { Drop, Modal } from '$lib/components';
    import { Button } from '$lib/elements/forms';
    import type { Column } from '$lib/helpers/types';
    import type { Writable } from 'svelte/store';
    import Content from './content.svelte';
    import {
        addFilter,
        queries,
        queriesAreDirty,
        queryParamToMap,
        tags,
        ValidOperators
    } from './store';
    import { createEventDispatcher } from 'svelte';

    export let query = '[]';
    export let columns: Writable<Column[]>;
    export let disabled = false;
    export let fullWidthMobile = false;
    export let singleCondition = false;
    export let clearOnClick = false; // When enabled the user doesn't have to click apply to clear the filters
    export let enableApply = false;
    export let quickFilters = false;
    let displayQuickFilters = quickFilters;

    const dispatch = createEventDispatcher();
    const parsedQueries = queryParamToMap(query);
    queries.set(parsedQueries);

    /* eslint  @typescript-eslint/no-explicit-any: 'off' */
    let value: any = null;
    let selectedColumn: string | null = null;
    let operatorKey: string | null = null;
    let arrayValues: string[] = [];

    // We need to separate them so we don't trigger Drop's handlers
    let showFiltersDesktop = false;
    let showFiltersMobile = false;

    let applied = $tags.length;

    beforeNavigate(() => {
        applied = $tags.length;
        showFiltersDesktop = false;
        showFiltersMobile = false;
    });

    function clearAll() {
        selectedColumn = null;
        queries.clearAll();
        if (clearOnClick) {
            queries.apply();
        }
    }

    function apply() {
        if (quickFilters && displayQuickFilters) {
            dispatch('apply');
        } else if (
            selectedColumn &&
            operatorKey &&
            (operatorKey === ValidOperators.IsNotNull ||
                operatorKey === ValidOperators.IsNull ||
                value ||
                arrayValues.length)
        ) {
            addFilter($columns, selectedColumn, operatorKey, value, arrayValues);
            selectedColumn = null;
            value = null;
            operatorKey = null;
            arrayValues = [];
        }
        queries.apply();
    }

    function afterApply(
        e: CustomEvent<{
            applied: number;
        }>
    ) {
        applied = e.detail.applied;
        if (singleCondition) {
            showFiltersDesktop = false;
            showFiltersMobile = false;
        }
    }

    $: if (!showFiltersDesktop && !showFiltersMobile) {
        selectedColumn = null;
        value = null;
        operatorKey = null;
        arrayValues = [];
    }

    $: isButtonDisabled =
        $queriesAreDirty || (quickFilters && displayQuickFilters && enableApply)
            ? false
            : !selectedColumn ||
              !operatorKey ||
              (!value &&
                  !arrayValues.length &&
                  operatorKey !== ValidOperators.IsNotNull &&
                  operatorKey !== ValidOperators.IsNull);

    function toggleDropdown() {
        dispatch('toggle', { show: !showFiltersDesktop });
        showFiltersDesktop = !showFiltersDesktop;
    }
    function toggleMobileModal() {
        dispatch('toggle', { show: !showFiltersMobile });
        showFiltersMobile = !showFiltersMobile;
    }
</script>

<div class="is-not-mobile">
    <Drop bind:show={showFiltersDesktop} noArrow>
        <slot {disabled} toggle={toggleDropdown}>
            <Button secondary on:click={toggleDropdown} {disabled}>
                <i class="icon-filter u-opacity-50" />
                Filters
                {#if applied > 0}
                    <span class="inline-tag">
                        {applied}
                    </span>
                {/if}
            </Button>
        </slot>
        <svelte:fragment slot="list">
            <div class="dropped card">
                {#if displayQuickFilters}
                    <slot name="quick" />
                {:else}
                    <p>Apply filter rules to refine the table view</p>
                    <Content
                        bind:columnId={selectedColumn}
                        bind:operatorKey
                        bind:value
                        bind:arrayValues
                        {columns}
                        {singleCondition}
                        on:apply={afterApply}
                        on:clear={() => (applied = 0)} />
                {/if}
                <hr />
                <div
                    class="u-flex u-cross-center u-margin-block-start-16"
                    class:u-main-end={!quickFilters}
                    class:u-main-space-between={quickFilters}>
                    {#if quickFilters}
                        <Button
                            text
                            on:click={() => (displayQuickFilters = !displayQuickFilters)}
                            class="u-margin-block-end-auto">
                            {displayQuickFilters ? 'Advanced filters' : 'Quick filters'}
                        </Button>
                    {/if}
                    <div class="u-flex u-gap-8">
                        {#if singleCondition}
                            <Button text on:click={toggleDropdown}>Cancel</Button>
                        {:else}
                            <Button disabled={applied === 0} text on:click={clearAll}>
                                Clear all
                            </Button>
                        {/if}
                        <Button on:click={apply} disabled={isButtonDisabled}>Apply</Button>
                    </div>
                </div>
            </div>
        </svelte:fragment>
    </Drop>
</div>

<div class="is-only-mobile">
    <slot name="mobile" {disabled} toggle={toggleMobileModal}>
        <Button secondary on:click={toggleMobileModal} {fullWidthMobile}>
            <i class="icon-filter u-opacity-50" />
            Filters
            {#if applied > 0}
                <span class="inline-tag">
                    {applied}
                </span>
            {/if}
        </Button>
    </slot>

    <Modal
        title="Filters"
        description="Apply filter rules to refine the table view"
        bind:show={showFiltersMobile}
        size="big">
        {#if displayQuickFilters}
            <slot name="quick" />
        {:else}
            <Content
                {columns}
                bind:columnId={selectedColumn}
                bind:operatorKey
                bind:value
                bind:arrayValues
                {singleCondition}
                on:apply={afterApply}
                on:clear={() => (applied = 0)} />
        {/if}
        <svelte:fragment slot="footer">
            <div
                class="u-flex u-cross-center u-width-full-line"
                class:u-main-end={!quickFilters}
                class:u-main-space-between={quickFilters}>
                {#if quickFilters}
                    <Button
                        text
                        noMargin
                        on:click={() => (displayQuickFilters = !displayQuickFilters)}
                        class="u-margin-block-end-auto">
                        {displayQuickFilters ? 'Advanced filters' : 'Quick filters'}
                    </Button>
                {/if}
                <div class="u-flex u-gap-8">
                    {#if singleCondition}
                        <Button text on:click={() => (showFiltersMobile = false)}>Cancel</Button>
                    {:else}
                        <Button text on:click={clearAll}>Clear all</Button>
                    {/if}
                    <Button on:click={apply} disabled={isButtonDisabled}>Apply</Button>
                </div>
            </div>
        </svelte:fragment>
    </Modal>
</div>

<style lang="scss">
    .dropped {
        border-radius: 0.5rem;
        box-shadow: 0px 16px 32px 0px rgba(55, 59, 77, 0.04);

        padding: 1rem;
        margin-top: 0.5rem;

        width: 37.5rem;

        hr {
            height: 1px;
            width: calc(100% + 2rem);
            background-color: hsl(var(--color-border));

            margin-block-start: 1rem;
            margin-inline: -1rem;
        }
    }
</style>
