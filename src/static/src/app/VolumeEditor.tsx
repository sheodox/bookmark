import { ChangeEvent, useEffect, useState } from 'react';
import { useSelectedSeries, useSelectedVolume, useStore } from './state/data';
import { theme } from './theme';

export function VolumeEditor() {
	const { updateVolume, loadVolumes } = useStore(),
		selectedSeries = useSelectedSeries(),
		selectedVolume = useSelectedVolume(),
		[editing, setEditing] = useState(false),
		[notes, setNotes] = useState(selectedVolume?.notes),
		[currentPage, setCurrentPage] = useState(selectedVolume?.currentPage),
		[pageError, setPageError] = useState(false),
		[saving, setSaving] = useState(false),
		resetState = (force = false) => {
			if ((force || !editing) && selectedVolume) {
				setNotes(selectedVolume.notes);
				setCurrentPage(selectedVolume.currentPage);
				setPageError(false);
			}
		};

	useEffect(resetState, [selectedVolume]);

	if (!selectedVolume || !selectedSeries) {
		return null;
	}

	const save = async () => {
			if (typeof notes === 'string' && typeof currentPage === 'number') {
				setSaving(true);
				await updateVolume(selectedVolume.id, { notes, name: selectedVolume.name, currentPage });
				setSaving(false);
				setEditing(false);
			}
		},
		startEditing = async () => {
			//ensure we're up to date before resuming any edit
			await loadVolumes(selectedSeries.id);
			setEditing(true);
		},
		cancelEditing = () => {
			resetState(true);
			setEditing(false);
		},
		onPageChange = (e: ChangeEvent<HTMLInputElement>) => {
			const newPages = e.target.value;

			if (/^\d+$/.test(newPages)) {
				setCurrentPage(+newPages);
				setPageError(false);
			} else {
				setPageError(true);
			}
		},
		inputClasses = 'rounded-md border border-slate-600 bg-slate-700 focus:outline-none focus:border-sky-500 p-2',
		editingButtons = editing ? (
			<div>
				<button className={theme.button.primary} onClick={save} disabled={pageError || saving}>
					Save
				</button>
				<button className={`ml-1 ${theme.button.secondary}`} onClick={cancelEditing}>
					Cancel
				</button>
			</div>
		) : (
			<div>
				<button className={theme.button.primary} onClick={startEditing}>
					Edit
				</button>
			</div>
		);

	return (
		<div className="flex-1 flex flex-col md:min-w-[40rem]">
			<div className="mb-6">
				<h1 className="text-4xl">
					{selectedVolume.name} - {selectedSeries.name}
				</h1>
			</div>
			{editing ? (
				<>
					<div className="flex justify-between items-center">
						<div>
							<label htmlFor="volume-current-page">Current Page</label>
							<div className="flex items-center">
								<input
									id="volume-current-page"
									defaultValue={selectedVolume.currentPage}
									className={`${inputClasses} w-24`}
									onChange={onPageChange}
								/>
							</div>
						</div>
						{editingButtons}
					</div>
					{pageError && <small className="text-red-400">Must enter a valid number!</small>}

					<div className="mt-4 flex flex-1 flex-col">
						<div className="flex justify-between items-end mb-1">
							<label htmlFor="volume-notes">Notes</label>
						</div>
						<textarea
							id="volume-notes"
							defaultValue={selectedVolume.notes}
							className={inputClasses + ' flex-1 resize-none'}
							onChange={(event) => setNotes(event.target.value)}
						></textarea>
					</div>
				</>
			) : (
				<>
					<div className="flex justify-between items-center">
						<div className="mb-4">
							<p>Current Page</p>
							<p className="text-4xl">{selectedVolume.currentPage}</p>
						</div>
						{editingButtons}
					</div>
					<p className="mb-1 border-b border-slate-700">Notes</p>
					<p className="whitespace-pre-line">
						{notes ? notes : <span className="text-slate-400 italic">You haven't written any notes yet.</span>}
					</p>
				</>
			)}
		</div>
	);
}
