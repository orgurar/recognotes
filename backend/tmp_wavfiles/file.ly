\version "2.20.0"   %! abjad.LilyPondFile._get_format_pieces()
\language "english" %! abjad.LilyPondFile._get_format_pieces()

\header { %! abjad.LilyPondFile._get_formatted_blocks()
    tagline = ##f
    title = \markup { YOYO }
} %! abjad.LilyPondFile._get_formatted_blocks()

\layout {}

\paper {}

\score { %! abjad.LilyPondFile._get_formatted_blocks()
    \new Staff
    {
        \tempo 4=120
        r16
        e8
        e16
        f'''8
        r4
        cs'''16
        d'''8
        r8
        cs'''16
        cs'''16
        c'''8
        r16
        b'''4
    }
} %! abjad.LilyPondFile._get_formatted_blocks()