\version "2.20.0"   %! abjad.LilyPondFile._get_format_pieces()
\language "english" %! abjad.LilyPondFile._get_format_pieces()

\header { %! abjad.LilyPondFile._get_formatted_blocks()
    tagline = ##f
    title = \markup { please }
} %! abjad.LilyPondFile._get_formatted_blocks()

\layout {}

\paper {}

\score { %! abjad.LilyPondFile._get_formatted_blocks()
    \new Staff
    {
        \tempo 4=100
        b,16
        r4
        b,16
        r2
        fs,16
        r8
        g16
        r2
        g16
        r4
        d8
        r16
        g16
        r4
    }
} %! abjad.LilyPondFile._get_formatted_blocks()