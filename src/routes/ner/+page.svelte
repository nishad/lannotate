<script>
	import ner from 'wink-ner';
	import winkTokenizer from 'wink-tokenizer';

	import saveAs from 'file-saver';

	import { DownloadOutline, FileCsvOutline, FileLinesOutline } from 'flowbite-svelte-icons';

	import { Label, Textarea } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';
	import { Heading } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		ButtonGroup
	} from 'flowbite-svelte';

	import { A } from 'flowbite-svelte';

	$: input = '';
	let entities = [];

	export const snapshot = {
		capture: () => input,
		restore: (value) => (input = value)
	};

	export let data;

	const clNER = ner();

	clNER.importJSON(JSON.stringify(data.model));

	const tokenize = winkTokenizer().tokenize;

	$: entities = clNER.recognize(tokenize(input));

	function loadSampleText() {
		input = data.sample_text;
	}

	function createPassage(elements) {
		let passage = '';

		elements.forEach((element, index) => {
			let space = ' ';
			if (index === 0 || element.tag === 'punctuation') {
				space = '';
			}

			// Use originalSeq if available, otherwise use value
			let text = element.originalSeq ? element.originalSeq.join(' ') : element.value;

			if (element.uid) {
				const url = `http://purl.obolibrary.org/obo/${element.uid}`;
				passage += `${space}<a href="${url}" class="bg-sky-200 underline decoration-sky-500" title="${element.uid}">${text}</a>`;
			} else {
				passage += space + text;
			}
		});
		return passage;
	}

	function downloadPubAnnotations() {
		const elements = entities;
		let text = '';
		let denotations = [];
		let currentIndex = 0;

		elements.forEach((element, index) => {
			// Use originalSeq if available, otherwise use value
			let elementText = element.originalSeq ? element.originalSeq.join(' ') : element.value;

			if (index !== 0 && element.tag !== 'punctuation') {
				text += ' ';
				currentIndex += 1; // Increment for the space added
			}

			if (element.uid) {
				denotations.push({
					id: `T${denotations.length + 1}`,
					span: {
						begin: currentIndex,
						end: currentIndex + elementText.length
					},
					obj: element.uid
				});
			}

			text += elementText;
			currentIndex += elementText.length;
		});

		let pubannotation = {
			text,
			denotations
		};

		const blob = new Blob([JSON.stringify(pubannotation)], { type: 'application/json' });
		// create a filestamp for the filename
		const date = new Date();
		// get an ISO timestamp for the filename, with zero padding
		const filestamp = date.toISOString().replace(/[:.]/g, '').replace('T', '_').replace('Z', '');
		saveAs(blob, `textae-annotation_${filestamp}.json`);
	}
</script>

<svelte:head>
	<title>Lannotate: Cell Ontology Named Entity Recognition</title>
	<meta name="description" content="Cell Ontology Named Entity Recognition" />
</svelte:head>

<div class="mx-auto flex w-full px-4">
	<main class="mx-auto w-full">
		<div class="flex flex-col items-center justify-center">
			<div class="w-full">
				<Label for="input-text" class="mb-2">Text to annotate</Label>
				<Textarea
					id="input-text"
					placeholder="Input your text to annotate"
					rows="12"
					name="input"
					bind:value={input}
				/>
				<Button size="xs" class="my-3" color="alternative" on:click={loadSampleText}
					>Load sample text</Button
				>
			</div>
		</div>
		<div>
			{#if entities.length > 0}
				<div class="flex flex-col items-center justify-center">
					<div class="w-full">
						<Heading tag="h6" class="my-8">Recognised Entities</Heading>
						<div class="flex flex-wrap">
							<Table>
								<TableHead>
									<TableHeadCell>ID</TableHeadCell>
									<TableHeadCell>Label</TableHeadCell>
									<TableHeadCell>Entity Type</TableHeadCell>
									<TableHeadCell>Original Input</TableHeadCell>
								</TableHead>
								<TableBody class="divide-y">
									{#each entities as entity}
										{#if entity.uid !== undefined}
											<TableBodyRow>
												<TableBodyCell
													><A href="http://purl.obolibrary.org/obo/{entity.uid}">{entity.uid}</A>
												</TableBodyCell>
												<TableBodyCell>{entity.value}</TableBodyCell>
												<TableBodyCell>{entity.entityType}</TableBodyCell>
												<TableBodyCell>{entity.originalSeq.join(' ')}</TableBodyCell>
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
		<div>
			{#if entities.length > 0}
				<Heading tag="h6" class="my-8">Annotated Text</Heading>
				<div class="mb-4 mt-4">
					<p>
						{@html createPassage(entities)}
					</p>
				</div>
			{/if}
		</div>
		{#if entities.length > 0}
			<div class="mt-4">
				<ButtonGroup>
					<Button size="xs" on:click={downloadPubAnnotations}>
						<DownloadOutline class="me-2 h-3 w-3" />
						Download TextAE Annotation JSON
					</Button>
				</ButtonGroup>
			</div>
		{/if}
	</main>
</div>
