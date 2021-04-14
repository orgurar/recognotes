\version "2.20.0"   %! abjad.LilyPondFile._get_format_pieces()
\language "english" %! abjad.LilyPondFile._get_format_pieces()

\header { %! abjad.LilyPondFile._get_formatted_blocks()
    tagline = ##f
    title = \markup { "It WSorkd!" }
} %! abjad.LilyPondFile._get_formatted_blocks()

\layout {}

\paper {}

\score { %! abjad.LilyPondFile._get_formatted_blocks()
    \new Staff
    {
        \tempo 4=100
        gs16
        r8
        gs16
        r8
        f16
        r16
        ds8
        cs'16
        r16
        ds16
        e16
        r8
        r16
        fs16
        r16
        e16
        r8
        cs'16
        r4
        gs16
        r4
        r8
        gs8
        gs8
        gs16
        gs8
        r4
        gs16
        r16
        fs16
        r16
        e16
        r16
        cs'8
        r4
        a16
        r4
        g16
        f8
        ds16
        cs'16
        r2
        fs16
        r8
        e16
        r16
        ds'16
        cs'16
        r8
        gs16
        r16
        a16
        as16
        r16
        gs16
        r16
        fs8
        r16
        e16
        gs2
        r8
        gs16
        fs16
        r16
        e8
        gs'16
    }
} %! abjad.LilyPondFile._get_formatted_blocks()