import { base } from '$app/paths';

export async function load({ fetch, params }) {
	const sample_text = `In the bustling world of cellular research, Dr. Alice Thompson ventured deep into the study of hematopoiesis, the process forming various blood cellular components. Her primary focus was on the intricate dance of differentiation and proliferation, particularly within the bone marrow, where hematopoietic stem cells serve as the wellspring for diverse blood cell types.

Her lab, equipped with the latest in microscopy and flow cytometry, was a hive of activity. Researchers meticulously tracked the journey of multipotent progenitors, noting their progression into more specialized forms. A significant portion of Alice's research centered on lymphoid progenitor cells, which were known to give rise to various lymphocytes.

In one corner of the lab, a team focused on the development of T cells from common lymphoid progenitors. They were particularly fascinated by the transition of these cells into CD4-positive, alpha-beta T cells, a critical component of the adaptive immune response.

Another group was engrossed in studying myeloid cells, particularly monocytes and their role in immune regulation. They were investigating how monocytes differentiate into macrophages and dendritic cells, both essential for the body's defense mechanisms.

Amidst the fluorescence-lit benches, Alice found herself marveling at the complexity of cellular differentiation. Each cell, from B cells to natural killer cells, played a unique and crucial role in the body's equilibrium. Her team's recent work on erythrocytes and their developmental pathway from erythroid progenitor cells was promising, potentially opening new avenues for treating blood disorders.

As the day drew to a close, Alice reflected on the beauty of cellular biology, a symphony of processes harmoniously orchestrated at the microscopic level. The Cell Ontology labels, she thought, were not just identifiers but signposts in a vast, uncharted biological landscape waiting to be explored.`;
	const res = await fetch(`${base}/data/cl-ner-wink-model_v01.json`);
	const model = await res.json();
	return { model, sample_text };
}
