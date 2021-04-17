import noise_engine as ne


def parse_audio_args(args):
    '''
    Function will pick the audio signal from the process' arguments.

    Parameters:
        args.

    Return:
        the audio signal, or None if the program should stop, and its sample rate       .
    '''
    # get sample rate from args
    sample_rate = args.sample_rate
    audio_signal = []

    # record at the specified sample rate
    if args.file is None:
        audio_signal = ne.record_mic_audio(fs=sample_rate, filename='user_input.wav')
    else:
        try:
            audio_signal = ne.read_wavfile(args.file, desiered_fs=sample_rate)
        except FileNotFoundError:
            print("Invalid parameter: file {} does not exist".format(args.file))
            exit
        except ValueError as wrong_fs:
            print("Invalid file: sample rate does not match {}".format(wrong_fs))
            exit
        except:
            print("Internal Error")
            exit

    return audio_signal, sample_rate, args.plot_output
