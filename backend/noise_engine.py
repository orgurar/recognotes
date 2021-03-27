import numpy as np
# import sounddevice as sd

# import wave
from scipy.io import wavfile

import math


SIGNAL_COEFFICIENT = 2 * np.pi
FS_SAMPLE_RATE = 8192  # Recording default sampling rate, in Hz, must be integer


# FUNCTION NOT IN USE!
"""def record_mic_audio(fs, filename='user_input.wav', chunk_size=1024, record_channels=1):
    import pyaudio
    RECORD_FORMAT = pyaudio.paInt16

    '''
    function will record sound for a arbitary time and save the record in a wav file

    Parameters:
        fs (integer): the sampling rate for the audio signal, measured in Hertz, default value is 8kHz.
        filename (str): .wav output file name

    Return:
        the audio signal as a numpy array
    '''

    # INNER FUNCTION TO RECORD THE AUDIO
    def record_audio(fs, chunk_size, record_channels):
        '''
        Function will record until the user pressed ctrl + c

        Parameters:
            fs (integer): the sampling rate for the audio signal, measured in Hertz, default value is 8kHz.
            chunk_size (integer): sframe chunks size (number of samples).

        Return:
            None
        '''
        p = pyaudio.PyAudio()
        stream = p.open(format=RECORD_FORMAT, channels=record_channels, rate=fs,
                        input=True, frames_per_buffer=chunk_size)

        print("Start Recording...\nPress CTRL + C at any time to stop")

        frames = []

        try:
            while True:
                data = stream.read(chunk_size)
                frames.append(data)
        except KeyboardInterrupt:
            print("Done recording")
        except Exception as e:
            print(str(e))

        sample_width = p.get_sample_size(RECORD_FORMAT)

        stream.stop_stream()
        stream.close()
        p.terminate()

        return sample_width, frames
    # END OF INNER FUNCTION

    # open destination file
    wf = wave.open(filename, 'wb')

    # set file's settings
    wf.setnchannels(record_channels)
    sample_width, frames = record_audio(fs, chunk_size, record_channels)
    wf.setsampwidth(sample_width)
    wf.setframerate(fs)

    # writing signal data
    wf.writeframes(b''.join(frames))

    wf.close()

    # convert and return the numpy array
    return read_wavfile(filename, fs)"""


def read_wavfile(filename, desiered_fs):
    '''
    Function will get a filename and transform it to a numpy array

    Parameters:
        filename (str): .wav file name
        desiered_fs (integer): the sample rate value the input value should be (validation)

    Return:
        a numpy array of the audio signal
    '''
    # read wavfile into a np.array
    signal_fs, signal = wavfile.read(filename)

    # make sure the file is in the right sample rate
    if abs(desiered_fs - signal_fs) > 1000:
        raise ValueError(signal_fs)

    return signal


# FUNCTIONS NOT IN USE
"""def compute_fft(signal, fs):
    '''
    function will compute the FFT of a given signal and its Power Spectral Graph

    Parameters:
        signal (np.array): the signal to compute its FFT
        fs (integer): signal's sample rate (kHz)

    Return:
        a tuple of the signal's PSD (Power Spectral Density) output, as well as frequencies vector. (np.array)
    '''
    signal_FFT = np.fft.fft(signal, n=fs)  # compute FFT
    signal_len = len(signal_FFT)

    # PSD - power to every freq there is in the signal
    signal_PSD = signal_FFT * np.conjugate(signal_FFT) / signal_len

    # building a vector of all the frequencies ordered
    # freq_vector = (fs / signal_len) * np.arange(signal_len)
    freq_vector = np.fft.fftfreq(signal_len, d=1/fs)

    # taking only the first half of mirrored FFT output
    first_half = np.arange(1, np.floor(signal_len/2), dtype='int')

    return signal_PSD[first_half], freq_vector[first_half]


def clean_fft(signal_PSD, min_limit=0.5):
    '''
    function will find the primary frequency from a signal's PSD graph

    Parameters:
        signal_PSD (np.array): power spectral density graph of the wanted signal

    Return:
        the primary frequency, or None if there isn't (integer)
    '''
    # limit is the max power (to get the primary note)
    try:
        max_power = np.amax(signal_PSD)
    except:
        print(signal_PSD)
        return None

    # only values above min_limit (0.1 by default)
    limit = max(max_power, min_limit)

    # building the new PSD boolean array
    clean_PSD = signal_PSD * False

    for i in range(0, len(clean_PSD)):
        if signal_PSD[i] == limit:  # found the max
            clean_PSD[i] = True
            return clean_PSD

    # None tells the calling function that there is no primary frequency
    return None


def extract_notes(signal_PSD, freq_vector):
    ''''
    function will extract musical notes from a given clean PSD audio

    Parameters:
       signal_PSD (np.array): clean power spectral density of boolean value
       freq_vector (np.array): a vector of ordered frequencies in the range

    Return:
        a tuple of the primary musical note presented by letters and octave, and ites frequency (Hz)
    '''

    # getting the index of the True value
    element_index = list(signal_PSD).index(True)

    # getting the 'real' frequency' from frequencies vector
    primary_frequency = freq_vector[element_index]

    # translating frequency (Hz) to musical note
    musical_note = frequency_to_note(primary_frequency)

    return musical_note, primary_frequency"""


def frequency_to_note(frequency):
    '''
    function will return the name of tyhe note by the frequency the function got
    Parameters:
       frequency: the frequency of the note

    Return:
        a tuple of the musical notes presented by letters

    Credits:
        function from Stack Overflow
        https://stackoverflow.com/questions/64505024/turning-a-frequency-into-a-note-in-python
    '''
    # define constants that control the algorithm
    NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
             'A', 'A#', 'B']  # these are the 12 notes in each octave
    OCTAVE_MULTIPLIER = 2  # going up an octave multiplies by 2
    KNOWN_NOTE_NAME, KNOWN_NOTE_OCTAVE, KNOWN_NOTE_FREQUENCY = (
        'A', 4, 440)  # A4 = 440 Hz

    # calculate the distance to the known note
    # since notes are spread evenly, going up a note will multiply by a constant
    # so we can use log to know how many times a frequency was multiplied to get from the known note to our note
    # this will give a positive integer value for notes higher than the known note, and a negative value for notes lower than it (and zero for the same note)
    note_multiplier = OCTAVE_MULTIPLIER**(1/len(NOTES))
    frequency_relative_to_known_note = frequency / KNOWN_NOTE_FREQUENCY
    distance_from_known_note = math.log(
        frequency_relative_to_known_note, note_multiplier)

    # round to make up for floating point inaccuracies
    distance_from_known_note = round(distance_from_known_note)

    # using the distance in notes and the octave and name of the known note,
    # we can calculate the octave and name of our note
    # NOTE: the "absolute index" doesn't have any actual meaning, since it doesn't care what its zero point is. it is just useful for calculation
    known_note_index_in_octave = NOTES.index(KNOWN_NOTE_NAME)
    known_note_absolute_index = KNOWN_NOTE_OCTAVE * \
        len(NOTES) + known_note_index_in_octave
    note_absolute_index = known_note_absolute_index + distance_from_known_note
    note_octave, note_index_in_octave = note_absolute_index // len(
        NOTES), note_absolute_index % len(NOTES)
    note_name = NOTES[note_index_in_octave]

    return (note_name, note_octave)
