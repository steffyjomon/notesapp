package com.notes.app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.notes.app.dto.Note;
import com.notes.app.services.NoteServices;

@RestController
@RequestMapping("notes")
public class NoteController {

	@Autowired
	NoteServices noteServices;

	@PostMapping(path = "/save", produces = { MediaType.APPLICATION_JSON_VALUE })
	public ResponseEntity<Note> saveNote(@RequestBody Note note) {
		return ResponseEntity.ok(noteServices.saveNote(note));
	}

	@GetMapping(path = "/get/{id}", produces = { MediaType.APPLICATION_JSON_VALUE })
	public ResponseEntity<Note> getNote(@PathVariable String id) {
		return ResponseEntity.of(noteServices.getNote(id));
	}

	@DeleteMapping(path = "/delete/{id}", produces = { MediaType.APPLICATION_JSON_VALUE })
	public ResponseEntity<String> deleteNote(@PathVariable String id) {
		noteServices.deleteNote(id);
		return ResponseEntity.ok("Deleted");
	}

	@GetMapping(path = "/get", produces = { MediaType.APPLICATION_JSON_VALUE })
	public ResponseEntity<List<Note>> getNoteList() {
		return ResponseEntity.ok(noteServices.getNoteList());
	}

}
