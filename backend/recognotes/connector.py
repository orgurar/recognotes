import noise_engine as ne

import crepe

def predict_notes(audio, fs):
    '''
    This function will estimate the frequencies from user's audio

    Parameters:
        audio (np.array): The recorded audio to get its pitches
        fs (integer): audio's sample rate

    Return:
        a list of the musical notes (computed by frequencies)

    Credits:
        crepe module - https://pypi.org/project/crepe/
    '''
    time, frequencies, confidence, activation = crepe.predict(audio, fs, model_capacity='tiny')

    notes = []
    for i in range(len(time)):
        musical_note_str = ""

        if not frequencies[i]:
            # empty note (musical rest)
            musical_note_str = "Empty"
        else:
            # get string representation of the note
            musical_note = ne.frequency_to_note(frequencies[i])
            musical_note_str = musical_note[0] + str(musical_note[1])

        note_list = [musical_note_str, confidence[i]]
        notes.append(tuple((note_list, time[i])))

    return notes