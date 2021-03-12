import abjad


MINUTE = 60

# every possible note beats count
NOTES_BEATS = [0.1, 0.25, 0.5, 1, 2, 3, 4]


def get_note_type(note_seconds, bpm):
    '''
    Function will tell the amount of beats in a note by its duration time.

    Parameters:
        notes_seconds (float): note's duration in seconds.
        bpm (integer): music's BPM (Beats Per Minute).

    Return:
        the amount of beats (nearest element in NOTES_BEATS list)
    '''
    # each beat time in seconds
    each_beat = MINUTE / bpm
    beats_in_note = note_seconds / each_beat

    # get the closest element in NOTES_BEATS list
    whole_beats_in_note = min(
        NOTES_BEATS, key=lambda x: abs(x - beats_in_note))

    # if the value is 0.1, there is no need to play the note
    if whole_beats_in_note == 0.1:
        return None

    return whole_beats_in_note


def proccess_notes(musical_notes, bpm, title, pdf_path):
    '''
    This is the 'main' function of the module, it will take the reduced notes,
    format it and its duration, and write it to a lilypond file.

    Parameters:
        musical_notes (list): music's notes to write in the PDF.
        bpm (integer): music's BPM (Beats Per Minute).
        title (str): Title of the final PDF music sheets.

    Return:
        None, calls all the function and finally writes the notes to the PDF file.
    '''
    final_notes = []
    for i in musical_notes:
        # get note type (half, whole note, etc)
        note_type = get_note_type(i[1], bpm)

        # if the answer is 'None' we shouldn't consider this note
        if note_type is not None:
            final_notes.append((i[0][0], note_type))
        else:
            continue

    # write the final notes array to output PDF file
    make_sheets_file(final_notes, bpm, title, pdf_path)


def get_abjad_duration(beats):
    '''
    note beats should be casted to note type (half a note, etc).

    Parameters:
        beats (float): amount of specific note's beats.

    Return:
       the maching fraction of note type.
    '''
    BEATS_TO_NOTE_TYPE = {
        0.25: (1, 16),
        0.5: (1, 8),
        1: (1, 4),
        2: (1, 2),
        3: (3, 4),
        4: 1
    }

    return BEATS_TO_NOTE_TYPE[beats]


def make_sheets_file(notes, bpm, title, pdf_path):
    '''
    Function will take the final notes data and write it to a PDF file using lilypond wrapper .

    Parameters:
        notes (list): a list of abjad Notes (or rests) ready to be written.
        bpm (integer): music's BPM (Beats Per Minute).
        title (str): Title of the final PDF music sheets.

    Return:
        None, displys PDF on screen.

    Credits:
        abjad module - https://pypi.org/project/abjad/
    '''
    # order notes and their durations
    abjad_notes = []
    for i in notes:
        # Duration
        duration = abjad.Duration(get_abjad_duration(i[1]))

        # Note can be a note, or empty (rest)
        act = None
        if i[0] == "Empty":
            act = abjad.Rest(duration)
        else:
            act = abjad.Note(i[0], duration)

        # append note
        abjad_notes.append(act)

    # cast notes to abjad.Staff
    staff = abjad.Staff(abjad_notes)

    # attach BPM to notes file
    metronome_mark = abjad.MetronomeMark((1, 4), bpm)
    abjad.attach(metronome_mark, staff[0])

    # creates lilypond file object
    lilypond_file = abjad.LilyPondFile.new(staff)

    # notes title
    lilypond_file.header_block.title = abjad.Markup(title)

    # set location of output PDF file
    if pdf_path is not None:
        abjad.persist.as_pdf(lilypond_file, pdf_path)
    # show PDF on screen
    else:
        abjad.show(lilypond_file)
