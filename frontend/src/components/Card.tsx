type CardProps = {
    label: string,
    children: React.ReactNode
}

export default function Card(props: CardProps) {
    return (
        <div className="card">
            <div className="card-label">{props.label}</div>
            {props.children}
        </div>
    )
}