package com.notes.app.dao.repositories;

import org.springframework.data.repository.CrudRepository;

import com.notes.app.dao.Note;

public interface NoteRepository extends CrudRepository<Note, String>{

}
