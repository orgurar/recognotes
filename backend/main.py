import graphic_io as gio
import connector
import reducer

import os


def main(audio_signal, sample_rate, plot_output, bpm, title, pdf_path=None):
    '''
    Recognotes' main function!
    this function will manage the notes detection procces from recording to creating the output PDF file.

    Parameters:
        audio_signal (np.array): the recorder audio to detect notes from.
        sample_rate (integer): recorded audio's sample rate.
        plot_output (bool): whether to plot output or not.
        bpm (integer): beats per minute of the recorded audio.
        title (str): the title to appear on the musical sheet.

    Return:
        None, displays PDF file at the end.
    '''
    # first, exctract notes by time using our connector module
    notes = connector.predict_notes(audio_signal, sample_rate)
    # clear crepe output
    os.system('clear')

    # run reduce algorithm to get only primary notes
    reduced_notes = reducer.notes_reducer(notes)

    # write notes to lilypond PDF file
    gio.proccess_notes(reduced_notes, bpm, title, pdf_path)
