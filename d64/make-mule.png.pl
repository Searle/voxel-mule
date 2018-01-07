#!/usr/bin/perl

use File::Slurp;
use Data::Dumper;
use File::Temp qw/ tempfile /;

my $prefix= "mule-";
my $height= 480;
my $double= 0;

$height= 20; $double= 1;

my $bin = read_file('mule.d64', binmode => ':raw'); $prefix= "mule2-";
# my $bin = read_file('MULE.bin', binmode => ':raw');

my @lines;
for ( $i= 0; $i < length($bin); $i++ ) {
    $lines[$i % $height] .= sprintf("%08b", ord(substr($bin, $i, 1)));
}
for ( ; $i % $height; $i++ ) {
    $lines[$i % $height] .= sprintf("%08b", 0);
}

my $width= length($lines[0]);

my ($fh, $filename) = tempfile();
print $fh "P1\n";
if ( $double ) {
    print $fh $width, " ", $height * 2, "\n";
    print $fh join("\n", map { join(" ", split(//)); } @lines) . "\n";
    print $fh join("\n", map { my $s= substr($_, 8) . substr($_, 0, 8); join(" ", split(//, $s)); } @lines) . "\n";
}
else {
    print $fh $width, " ", $height, "\n";
    print $fh join("\n", map { join(" ", split(//)); } @lines) . "\n";
}
close $fh;

# print `cat "$filename"`; die;
# print `cp "$filename" X`; die;

`convert "$filename" "$prefix$height.png"`;
