# empty note representation
EMPTY_NOTE = ["Empty", 0.0]


def notes_reducer(notes_array):
    '''
    Function will host the notes reduction, it will run all the algorithms on it.

    Parameters:
        notes_array (list): notes_array (list): list of notes to reduce.
            example: [(['A4', 0.8], 0.2), ...]

    Return:
        a new list of notes (at the same format), but reduced.
    '''
    # firstly, reduce array by repeated values to get a cleaner and easier view
    reduced_array = reduce_by_straight_values(notes_array)

    # then, we can get rid of every notes sequence under a specified time threshold
    last_end_time = notes_array[-1][1]
    reduced_by_time_array = reduce_by_min_time(reduced_array, last_end_time)

    # there still can be sequences, so run the first algorithm for the last time
    final_reduced_array = reduce_by_straight_values(reduced_by_time_array)

    # order notes in a new array, now we take the duration and not the start time of a note
    new_notes = []
    for i in range(len(final_reduced_array) - 1):
        # save the time duration
        delta_time = final_reduced_array[i + 1][1] - final_reduced_array[i][1]
        # and append it to the new list
        new_notes.append((final_reduced_array[i][0], delta_time))

    # the last element has to be considered also
    last_element_delta_time = last_end_time - final_reduced_array[-1][1]
    new_notes.append((final_reduced_array[-1][0], last_element_delta_time))

    return new_notes


def reduce_by_straight_values(notes_array):
    '''
    Function will reduce the notes array by combining notes.
    It will comboine every similar notes in a row to a longer notes (keep the time and frequency).

    Parameters:
        notes_array (list): list of notes to reduce. 

    Return:
        a new list of notes (at the same format), but reduced.
    '''
    # save information between the loop iterations
    curr_elements_count = 0
    curr_confident_sum = 0
    curr_note = None

    final_list = []

    i = 0
    while i < len(notes_array):
        # checks is the notes sequence continues
        if notes_array[i][0][0] == curr_note:
            curr_elements_count += 1
            curr_confident_sum += notes_array[i][0][1]
        else:
            # now straight is ended, we should check if we have a sequence
            if curr_elements_count != 0:
                # calculate info (such as confident and time duration)
                confident_avg = curr_confident_sum / curr_elements_count
                note_list = [curr_note, confident_avg]
                start_time = notes_array[i - curr_elements_count][1]
                # append the sequence as a single longer note
                final_list.append((note_list, start_time))

            # starts again a new sequence
            curr_elements_count = 1
            curr_confident_sum = notes_array[i][0][1]
            curr_note = notes_array[i][0][0]

        # increase loop's variable
        i += 1

    # check again if there is another sequence that ends with the list
    if curr_elements_count:
        confident_avg = curr_confident_sum / curr_elements_count
        note_list = [curr_note, confident_avg]
        start_time = notes_array[i - curr_elements_count][1]
        # append to the end of the list
        final_list.append((note_list, start_time))

    return final_list


def reduce_by_min_time(notes_array, last_end_time, time_limit=0.1):
    '''
    Function will remove all the notes sequences under a specified time limit.

    Parameters:
        notes_array (list): list of notes to reduce.
        last_end_time (float): the end time (to take dt(delta time) of the last note).
        time_limit (float): min time of sequence to stay in the list.

    Return:
        a new list of notes (at the same format), but reduced.
    '''
    reduced_notes = []

    # pass on every note, the last one is out of the for loop
    for i in range(len(notes_array) - 1):
        # takes the time duration of the current note (every note has its start time only)
        delta_time = notes_array[i + 1][1] - notes_array[i][1]

        # if the sequence fits the time limit, so it stays in
        if delta_time > time_limit:
            reduced_notes.append(notes_array[i])
        # if not, we have to replace it with an empty note
        else:
            reduced_notes.append((EMPTY_NOTE, notes_array[i][1]))

    # now we have to calculate the last element's duration and check for it also
    if last_end_time - notes_array[-1][1] > time_limit:
        reduced_notes.append(notes_array[-1])
    else:
        reduced_notes.append((EMPTY_NOTE, notes_array[-1][1]))

    # edge case: if the first note doesn't start on time 0, we have to pad it by a rest
    if reduced_notes[0][1] != 0:
        start_rest = tuple((EMPTY_NOTE, 0.0))
        reduced_notes.insert(0, start_rest)

    return reduced_notes
