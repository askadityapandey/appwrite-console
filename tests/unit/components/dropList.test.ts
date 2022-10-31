import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/svelte';
import { DropList } from '../../../src/lib/components';

const data = {
    show: true
};

test('shows drop list component', () => {
    render(DropList, { ...data });
    const wrapper = document.querySelector('div');
    const dropList = document.querySelector('ul.drop-list');

    expect(wrapper).toBeInTheDocument();
    expect(dropList).toBeInTheDocument();
});

test('hide drop list on body click', async () => {
    const { component } = render(DropList, { ...data });
    await fireEvent.click(document.body);
    expect(component.show).toStrictEqual(false);
});

test('hide drop list on wrapper click', async () => {
    const { component } = render(DropList, { ...data });
    const wrapper = document.querySelector('div');

    await fireEvent.click(wrapper);
    expect(component.show).toStrictEqual(false);
});
