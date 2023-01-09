package com.notes.app.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.notes.app.dao.repositories.NoteRepository;
import com.notes.app.dto.Note;
import com.notes.app.transformers.NoteDaoDtoTransformer;

@Service
public class NoteServicesImpl implements NoteServices {

	@Autowired
	private NoteRepository noteRepository;

	@Autowired
	NoteDaoDtoTransformer noteDaoDtoTransformer;

	public Optional<Note> getNote(String id) {
		return noteRepository.findById(id).map(noteDaoDtoTransformer::getDTO);
	}

	@Override
	public Note saveNote(Note note) {
		if (note.getId() == null || note.getId().trim().isEmpty()) {
			note.setId(UUID.randomUUID().toString());
		}
		return noteDaoDtoTransformer.getDTO(noteRepository.save(noteDaoDtoTransformer.getDAO(note)));
	}

	@Override
	public List<Note> getNoteList() {
		List<Note> noteList = new ArrayList<>();
		noteRepository.findAll().forEach(noteDao -> noteList.add(noteDaoDtoTransformer.getDTO(noteDao)));
		return noteList;
	}

	@Override
	public void deleteNote(String id) {
		noteRepository.deleteById(id);
	}

}
