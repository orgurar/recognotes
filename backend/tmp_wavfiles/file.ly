\version "2.20.0"   %! abjad.LilyPondFile._get_format_pieces()
\language "english" %! abjad.LilyPondFile._get_format_pieces()

\header { %! abjad.LilyPondFile._get_formatted_blocks()
    tagline = ##f
    title = \markup { metronome }
} %! abjad.LilyPondFile._get_formatted_blocks()

\layout {}

\paper {}

\score { %! abjad.LilyPondFile._get_formatted_blocks()
    \new Staff
    {
        \tempo 4=100
        r2
        a''16
        r8
        a''16
        r8
        a''16
        r4
        a''16
        r8
        a''16
        r8
        a''16
    }
} %! abjad.LilyPondFile._get_formatted_blocks()