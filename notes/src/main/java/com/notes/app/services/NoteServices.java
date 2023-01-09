package com.notes.app.services;

import java.util.List;
import java.util.Optional;

import com.notes.app.dto.Note;

public interface NoteServices {

	public Note saveNote(Note note);

	public Optional<Note> getNote(String id);

	public List<Note> getNoteList();

	public void deleteNote(String id);

}
