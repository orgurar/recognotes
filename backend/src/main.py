import graphic_io as gio
import connector
import reducer
from args_parser import parse_audio_args

import os
import argparse


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


if __name__ == "__main__":
    # parse main args
    parser = argparse.ArgumentParser(
        description='Analyze audio signals and notes detection.')
    parser.add_argument('-f', '--file', help='input wavfile')
    parser.add_argument('-s', '--sample-rate', type=int, default=8192)
    parser.add_argument('-p', '--plot', dest='plot_output', action='store_const', const=True,
                        default=False, help='plot chunks output')

    # exctracting user specified arguments
    args = parser.parse_args()

    # get BPM and musical sheets title
    bpm = int(input("Enter BPM: "))
    title = str(input("Enter Title: "))

    audio_signal, sample_rate, plot_output = parse_audio_args(args)

    # calling main function with parameters
    main(audio_signal, sample_rate, plot_output, bpm, title)
