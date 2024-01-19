<script>
	import { search } from '@orama/orama';
	import { restore } from '@orama/plugin-data-persistence';

	import PreloadingIndicator from '$lib/components/utils/PreloadingIndicator.svelte';

	import { Label, Textarea, Input } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';
	import { Heading } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import { A } from 'flowbite-svelte';

	$: input = '';
	let results = [];
	let entities = [];

	export const snapshot = {
		capture: () => input,
		restore: (value) => (input = value)
	};

	let index;
	// Set loading to be null at first
	$: loading = null;

	async function loadSampleText() {
		input = `blood`;
	}

	async function loadIndex() {
		if (index) index = null;

		// Set loading to be true
		loading = true;

		// Do task
		const data = await fetch(`../data/cell-ontology-index_v01.json`);
		let JSONIndex = await data.text();

		index = await restore('json', JSONIndex);

		// Set loading to be false;
		loading = false;
	}

	async function doSearch(term) {
		// if index is not loaded, do nothing
		if (!index) return;
		// if term is empty, do nothing
		if (!term || term === '') return;
		console.log('searching');
		results = await search(index, { term: term, limit: 25 });
		// console.log(results);
		results = results.hits;
	}

	$: doSearch(input);
</script>

<div class="w-full">
	<PreloadingIndicator {loading} />
</div>

{#if index}
	<div>
		<main class="mx-auto w-full">
			<div class="flex flex-col items-center justify-center">
				<div class="w-full">
					<Label for="input-text" class="mb-2">Serch term</Label>
					<Input
						id="input-text"
						placeholder="Input your search term"
						name="input"
						bind:value={input}
					/>
				</div>
			</div>
			<div>
				{#if results.length > 0}
					<div class="flex flex-col items-center justify-center">
						<div class="w-full">
							<Heading tag="h6" class="my-8">{results.length} Results</Heading>
							<div class="flex flex-wrap">
								<Table>
									<TableHead>
										<TableHeadCell>ID</TableHeadCell>
										<TableHeadCell>Label</TableHeadCell>
										<TableHeadCell>Score</TableHeadCell>
									</TableHead>
									<TableBody class="divide-y">
										{#each results as result}
											{#if result.id !== undefined}
												<TableBodyRow>
													<TableBodyCell
														><A href="http://purl.obolibrary.org/obo/{result.id}">{result.id}</A>
													</TableBodyCell>
													<TableBodyCell>{result.document.label}</TableBodyCell>
													<TableBodyCell>{result.score}</TableBodyCell>
												</TableBodyRow>
											{/if}
										{/each}
									</TableBody>
								</Table>
							</div>
						</div>
					</div>
				{/if}
			</div>
		</main>
	</div>
{:else}
	<div class="w-full">
		<div class="w-full">
			<Button size="xs" class="my-3" color="alternative" on:click={loadIndex}>Load index</Button>
		</div>
	</div>
{/if}
