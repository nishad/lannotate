<script>
	import { search } from '@orama/orama';
	import { restore } from '$lib/orama-data-persistence';

	import { pipeline } from '@xenova/transformers';

	import { base } from '$app/paths';

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

	export const snapshot = {
		capture: () => input,
		restore: (value) => (input = value)
	};

	let index;
	let pipe;

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
		const data = await fetch(`${base}/data/cell-ontology-vector-index_v01.json`);
		let JSONIndex = await data.text();
		index = await restore('json', JSONIndex);
		pipe = await pipeline('feature-extraction', 'Supabase/gte-small');

		// Set loading to be false;
		loading = false;
	}

	async function generateEmbedding(text) {
		try {
			const output = await pipe(text, {
				pooling: 'mean',
				normalize: true
			});
			return Array.from(output.data);
		} catch (error) {
			console.error('Error in generateEmbedding:', error);
		}
	}

	async function doSearch(term) {
		// if index is not loaded, do nothing
		if (!index) return;
		// if term is empty, do nothing
		if (!term || term === '') {
			results = [];
			return;
		}
		const termEmbedding = await generateEmbedding(term);
		// results = await search(index, { term: term, limit: 25 });
		// console.log(results);
		results = await search(index, {
			mode: 'vector',
			vector: {
				value: termEmbedding,
				property: 'embedding'
			},
			similarity: 0.8, // Minimum similarity. Defaults to `0.8`
			includeVectors: false, // Defaults to `false`
			limit: 10, // Defaults to `10`
			offset: 0 // Defaults to `0`
		});
		// console.log(results);
		results = results.hits;
	}

	$: doSearch(input);
</script>

<svelte:head>
	<title>Lannotate: Cell Ontology Vector search</title>
	<meta name="description" content="Cell Ontology Vector search" />
</svelte:head>

<div class="w-full">
	<PreloadingIndicator {loading} />
</div>

{#if index && !loading}
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
										<TableHeadCell>Similarity</TableHeadCell>
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
{:else if !loading}
	<div class="w-full">
		<div class="w-full">
			<Button size="xs" class="my-3" color="alternative" on:click={loadIndex}
				>Load model and index</Button
			>
		</div>
	</div>
{/if}
