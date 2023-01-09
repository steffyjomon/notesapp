package com.notes.app.transformers;

import org.springframework.stereotype.Component;

import com.notes.app.dto.Note;

@Component
public class NoteDaoDtoTransformer {

	public Note getDTO(com.notes.app.dao.Note daoNote) {

		return new Note(daoNote.getId(), daoNote.getTitle(), daoNote.getContent());

	}

	public com.notes.app.dao.Note getDAO(Note dtoNote) {

		return new com.notes.app.dao.Note(dtoNote.getId(), dtoNote.getTitle(), dtoNote.getContent());
	}
}
