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
        \tempo 4=100
        r4
        a16
        r16
        as8
        r16
        as16
        r8
        d'8
        r2
        e''16
        r4
        as4
    }
} %! abjad.LilyPondFile._get_formatted_blocks()