type FormattedValueProps = {
    mainValue: number | string,
    unit?: string
}

export default function formattedValue(props: FormattedValueProps) {
    return (
        <>
            <span className="value-main">{props.mainValue}</span>
            <span className="value-unit">{props?.unit}</span>
        </>
    );
}