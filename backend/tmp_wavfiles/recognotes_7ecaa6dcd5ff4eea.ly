\version "2.20.0"   %! abjad.LilyPondFile._get_format_pieces()
\language "english" %! abjad.LilyPondFile._get_format_pieces()

\header { %! abjad.LilyPondFile._get_formatted_blocks()
    tagline = ##f
    title = \markup { mazor }
} %! abjad.LilyPondFile._get_formatted_blocks()

\layout {}

\paper {}

\score { %! abjad.LilyPondFile._get_formatted_blocks()
    \new Staff
    {
        \tempo 4=120
        r2.
        a16
        r16
        a'4
        a'8
        r16
        a'2
        r4
    }
} %! abjad.LilyPondFile._get_formatted_blocks()