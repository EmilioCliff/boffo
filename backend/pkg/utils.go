package pkg

import (
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5/pgtype"
)

const timeFormat = "01/02/2006"

func PgTypeNumericToFloat64(n pgtype.Numeric) float64 {
	f, err := n.Float64Value()
	if err != nil {
		log.Println("not float")
		return 0
	}

	return f.Float64
}

func Float64ToPgTypeNumeric(f float64) pgtype.Numeric {
	var amount pgtype.Numeric
	if err := amount.Scan(strconv.FormatFloat(f, 'f', -1, 64)); err != nil {
		log.Println("not float")
		return pgtype.Numeric{
			Valid: false,
		}
	}

	return amount
}

func StringToTime(s string) (time.Time, error) {
	if s == "" {
		return time.Now(), nil
	}

	t, err := time.Parse(timeFormat, s)
	if err != nil {
		log.Println("not time")
		return time.Now(), err
	}

	return t, nil
}

func StrToTime(s string) (time.Time, error) {
	if s == "" {
		return time.Now(), nil
	}

	layouts := []string{
		"2006-01-02",
		"2006-01-02T15:04:05Z",
		"2006-01-02T15:04:05Z07:00",
	}

	var parsed time.Time
	var err error

	for _, layout := range layouts {
		parsed, err = time.Parse(layout, s)
		if err == nil {
			return parsed, nil
		}
	}

	return time.Time{}, fmt.Errorf("invalid date format: %s", s)
}

func StringToBool(s string) bool {
	if s == "" {
		return false
	}

	b, err := strconv.ParseBool(s)
	if err != nil {
		log.Println("not bool")
		return false
	}

	return b
}

func StringToInt64(s string) (int64, error) {
	i, err := strconv.ParseUint(s, 10, 32)
	if err != nil {
		log.Println("not uint32")
		return 0, err
	}

	return int64(i), nil
}

func StringToUint32(s string) (uint32, error) {
	i, err := strconv.ParseUint(s, 10, 32)
	if err != nil {
		log.Println("not uint32")
		return 0, err
	}

	return uint32(i), nil
}
