\version "2.20.0"   %! abjad.LilyPondFile._get_format_pieces()
\language "english" %! abjad.LilyPondFile._get_format_pieces()

\header { %! abjad.LilyPondFile._get_formatted_blocks()
    tagline = ##f
    title = \markup { asd }
} %! abjad.LilyPondFile._get_formatted_blocks()

\layout {}

\paper {}

\score { %! abjad.LilyPondFile._get_formatted_blocks()
    \new Staff
    {
        \tempo 4=120
        r16
        e16
        r16
        g16
        gs16
        r8
    }
} %! abjad.LilyPondFile._get_formatted_blocks()