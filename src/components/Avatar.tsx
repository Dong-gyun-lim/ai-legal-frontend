type Props = { size?: number; name?: string; src?: string; className?: string };

export default function Avatar({ size = 32, name, src, className = '' }: Props) {
    const style = { width: size, height: size };
    if (src) {
        return (
            <img
                src={src}
                alt={name ?? 'avatar'}
                style={style}
                className={`rounded-full object-cover border border-slate-300 ${className}`}
            />
        );
    }
    const initials = (name ?? 'U')
        .split(' ')
        .map((s) => s[0]?.toUpperCase())
        .join('')
        .slice(0, 2);

    return (
        <div
            style={style}
            className={`rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-semibold ${className}`}
        >
            {initials}
        </div>
    );
}
