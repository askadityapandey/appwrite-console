<script lang="ts">
    import { Drop } from '.';
    import type { Placement } from './drop.svelte';

    export let show = false;
    export let placement: Placement = 'bottom-start';
    export let fixed = false;
    export let scrollable = false;
    export let childStart = false;
    export let noArrow = false;
    export let noStyle = false;
    export let width: string = null;
    export let fullWidth = false;
    export let wrapperFullWidth = false;
    export let position: 'relative' | 'static' = 'relative';
    export let noMaxWidthList = false;
    let classes: string = '';
    export { classes as class };
</script>

<Drop
    bind:show
    {placement}
    {childStart}
    {noArrow}
    {noStyle}
    {fullWidth}
    {wrapperFullWidth}
    {fixed}
    on:blur>
    <slot />
    <svelte:fragment slot="list">
        <div
            class="drop is-no-arrow {classes}"
            class:u-max-width-100-percent={fullWidth}
            style:--drop-width-size-desktop={width ? `${width}rem` : ''}
            style:position>
            {#if $$slots.list}
                <section
                    class:u-overflow-y-auto={scrollable}
                    class:u-max-height-200={scrollable}
                    class="drop-section"
                    style={noMaxWidthList ? 'max-inline-size: 100%' : ''}>
                    <ul class="drop-list">
                        <slot name="list" />
                    </ul>
                </section>
            {/if}
            <slot name="other" />
        </div>
    </svelte:fragment>
</Drop>
