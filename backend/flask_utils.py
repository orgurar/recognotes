import noise_engine as ne


def get_wav_content(wavfile_path, sample_rate):
    '''
    Function will pick the audio signal from the process' arguments.

    Parameters:
        args.

    Return:
        the audio signal, or None if the program should stop, and its sample rate       .
    '''
    # get sample rate from args
    audio_signal = []

    # record at the specified sample rate
    try:
        audio_signal = ne.read_wavfile(wavfile_path, desiered_fs=sample_rate)
    except FileNotFoundError:
        return {"error": f"Invalid parameter: file {wavfile_path} does not exist"}
    except ValueError as wrong_fs:
        return {"error": f"Invalid file: sample rate does not match {wrong_fs}"}
    except:
        return {"error": "Internal Error"}

    return audio_signal, sample_rate
